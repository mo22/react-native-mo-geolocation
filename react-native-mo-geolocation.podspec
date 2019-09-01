require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |spec|
  name = package['name']
  spec.name = name
  spec.version = package['version']
  spec.ios.deployment_target = '9.0'
  spec.requires_arc = true
  spec.source_files = "ios/*/*.{h,m}"
  spec.dependency "React"
  spec.summary = package['description'] or "none"
  spec.homepage = package['homepage'] or "none"
  spec.license = package['license']
  spec.authors = package['author']
  spec.source = { :git => package['repository']['url'] }
end
