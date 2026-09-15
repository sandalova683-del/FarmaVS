import Foundation
import HealthKit
import Capacitor
import UIKit

@objc(FormulaVSHealthPlugin)
public class FormulaVSHealthPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "FormulaVSHealth"
    public let jsName = "FormulaVSHealth"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "getStatus", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "requestPermissions", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "openSettings", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getSteps", returnType: CAPPluginReturnPromise)
    ]

    private let healthStore = HKHealthStore()
    private var stepType: HKQuantityType? { HKObjectType.quantityType(forIdentifier: .stepCount) }

    @objc func getStatus(_ call: CAPPluginCall) {
        guard HKHealthStore.isHealthDataAvailable() else {
            call.resolve(["status": "unavailable", "platform": "ios"])
            return
        }
        guard let type = stepType else {
            call.resolve(["status": "unavailable", "platform": "ios"])
            return
        }
        // HealthKit intentionally does not expose a definitive read-authorization status.
        // Treat status as permission_required until a read succeeds; the app can then
        // show connected data without inferring privacy-sensitive authorization state.
        call.resolve(["status": "permission_required", "platform": "ios", "canOpenSettings": true])
    }

    @objc func requestPermissions(_ call: CAPPluginCall) {
        guard HKHealthStore.isHealthDataAvailable(), let type = stepType else {
            call.resolve(["status": "unavailable", "platform": "ios"])
            return
        }
        healthStore.requestAuthorization(toShare: [], read: [type]) { [weak self] success, error in
            DispatchQueue.main.async {
                if let error {
                    call.reject(error.localizedDescription, nil, error)
                    return
                }
                call.resolve(["status": success ? "connected" : "permission_required", "platform": "ios", "canOpenSettings": true])
            }
        }
    }

    @objc func openSettings(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            guard let url = URL(string: UIApplication.openSettingsURLString) else {
                call.resolve(["opened": false]); return
            }
            UIApplication.shared.open(url, options: [:]) { opened in
                call.resolve(["opened": opened])
            }
        }
    }

    @objc func getSteps(_ call: CAPPluginCall) {
        guard let dateString = call.getString("date"), let type = stepType else {
            call.reject("A date is required"); return
        }
        guard HKHealthStore.isHealthDataAvailable() else {
            call.resolve(["status":"unavailable", "value":NSNull(), "source":"unsupported", "date":dateString]); return
        }
        guard let day = Self.parseLocalDate(dateString) else {
            call.reject("Invalid date: \(dateString)"); return
        }
        let start = Calendar.current.startOfDay(for: day)
        guard let end = Calendar.current.date(byAdding: .day, value: 1, to: start) else {
            call.reject("Unable to calculate date range"); return
        }

        let predicate = HKQuery.predicateForSamples(withStart: start, end: end, options: .strictStartDate)
        let query = HKStatisticsQuery(quantityType: type, quantitySamplePredicate: predicate, options: .cumulativeSum) { _, statistics, error in
            DispatchQueue.main.async {
                if let error {
                    call.reject(error.localizedDescription, nil, error); return
                }
                let count = statistics?.sumQuantity()?.doubleValue(for: HKUnit.count()) ?? 0
                call.resolve([
                    "status": "connected",
                    "value": Int(count.rounded()),
                    "source": "healthkit",
                    "date": dateString
                ])
            }
        }
        healthStore.execute(query)
    }

    private static func parseLocalDate(_ value: String) -> Date? {
        let f = DateFormatter()
        f.calendar = Calendar(identifier: .gregorian)
        f.locale = Locale(identifier: "en_US_POSIX")
        f.timeZone = .current
        f.dateFormat = "yyyy-MM-dd"
        return f.date(from: value)
    }
}
