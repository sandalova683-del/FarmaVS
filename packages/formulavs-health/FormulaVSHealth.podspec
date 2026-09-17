Pod::Spec.new do |s|
  s.name = 'FormulaVSHealth'
  s.version = '4.1.0'
  s.summary = 'FormulaVS HealthKit bridge'
  s.license = { :type => 'MIT' }
  s.homepage = 'https://formulavs.app'
  s.author = 'FormulaVS'
  s.source = { :path => '.' }
  s.source_files = 'ios/Sources/FormulaVSHealth/**/*.{swift,h,m}'
  s.ios.deployment_target = '15.0'
  s.dependency 'Capacitor'
  s.frameworks = 'HealthKit'
  s.swift_version = '5.9'
end
