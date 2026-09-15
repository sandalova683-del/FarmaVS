package com.formulavs.health

import android.content.Intent
import android.net.Uri
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.StepsRecord
import androidx.health.connect.client.request.AggregateRequest
import androidx.health.connect.client.time.TimeRangeFilter
import com.getcapacitor.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId

@CapacitorPlugin(name = "FormulaVSHealth")
class FormulaVSHealthPlugin : Plugin() {
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)
    private lateinit var client: HealthConnectClient
    private val readSteps = HealthPermission.getReadPermission(StepsRecord::class)

    override fun load() {
        super.load()
        if (isHealthConnectAvailable()) {
            client = HealthConnectClient.getOrCreate(context)
        }
    }

    @PluginMethod
    fun getStatus(call: PluginCall) {
        if (!isHealthConnectAvailable()) {
            call.resolve(JSObject().put("status", "unavailable").put("platform", "android"))
            return
        }
        scope.launch {
            try {
                val granted = client.permissionController.getGrantedPermissions()
                val status = if (readSteps in granted) "connected" else "permission_required"
                call.resolve(JSObject().put("status", status).put("platform", "android").put("canOpenSettings", true))
            } catch (t: Throwable) {
                call.reject(t.message ?: "Unable to read Health Connect permissions", t)
            }
        }
    }

    @PluginMethod
    fun requestPermissions(call: PluginCall) {
        if (!isHealthConnectAvailable()) {
            call.resolve(JSObject().put("status", "unavailable").put("platform", "android"))
            return
        }
        scope.launch {
            try {
                val granted = client.permissionController.requestPermissions(setOf(readSteps))
                val status = if (readSteps in granted) "connected" else "permission_required"
                call.resolve(JSObject().put("status", status).put("platform", "android").put("canOpenSettings", true))
            } catch (t: Throwable) {
                call.reject(t.message ?: "Unable to request Health Connect permissions", t)
            }
        }
    }

    @PluginMethod
    fun openSettings(call: PluginCall) {
        try {
            val intent = Intent(HealthConnectClient.ACTION_HEALTH_CONNECT_SETTINGS)
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(intent)
            call.resolve(JSObject().put("opened", true))
        } catch (t: Throwable) {
            call.resolve(JSObject().put("opened", false))
        }
    }

    @PluginMethod
    fun getSteps(call: PluginCall) {
        val date = call.getString("date")
        if (date.isNullOrBlank()) { call.reject("A date is required"); return }
        if (!isHealthConnectAvailable()) {
            call.resolve(JSObject().put("status", "unavailable").put("value", null).put("source", "unsupported").put("date", date))
            return
        }
        scope.launch {
            try {
                val granted = client.permissionController.getGrantedPermissions()
                if (readSteps !in granted) {
                    call.resolve(JSObject().put("status", "permission_required").put("value", null).put("source", "health_connect").put("date", date))
                    return@launch
                }
                val day = LocalDate.parse(date)
                val zone = ZoneId.systemDefault()
                val start = day.atStartOfDay(zone).toInstant()
                val end = day.plusDays(1).atStartOfDay(zone).toInstant()
                val response = client.aggregate(
                    AggregateRequest(
                        metrics = setOf(StepsRecord.COUNT_TOTAL),
                        timeRangeFilter = TimeRangeFilter.between(start, end)
                    )
                )
                val value = response[StepsRecord.COUNT_TOTAL] ?: 0L
                call.resolve(JSObject()
                    .put("status", "connected")
                    .put("value", value)
                    .put("source", "health_connect")
                    .put("date", date))
            } catch (t: Throwable) {
                call.reject(t.message ?: "Unable to read steps from Health Connect", t)
            }
        }
    }

    private fun isHealthConnectAvailable(): Boolean {
        return try {
            HealthConnectClient.getSdkStatus(context, "com.google.android.apps.healthdata") == HealthConnectClient.SDK_AVAILABLE
        } catch (_: Throwable) { false }
    }
}
