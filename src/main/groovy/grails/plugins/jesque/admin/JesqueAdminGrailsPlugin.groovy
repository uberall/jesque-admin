package grails.plugins.jesque.admin

import grails.plugins.*

class JesqueAdminGrailsPlugin extends Plugin {

    def grailsVersion = "3.0.0 > *"
    def pluginExcludes = [
        "grails-app/jobs/**"
    ]

    def title = "Jesque Admin" // Headline display name of the plugin
    def author = "Philipp Eschenbach"
    def authorEmail = "philipp@errbuddy.net"
    def description = '''Admin UI for the Grails Jesque Plugin'''

    def loadAfter = ['jesque']

    def profiles = ['web']

    def documentation = "https://github.com/peh/jesque-admin"

    // Extra (optional) plugin metadata

    // License: one of 'APACHE', 'GPL2', 'GPL3'
//    def license = "APACHE"

    // Details of company behind the plugin (if there is one)
    def organization = [ name: "uberall", url: "https://uberall.com/" ]

    // Any additional developers beyond the author specified above.
//    def developers = [ [ name: "Joe Bloggs", email: "joe@bloggs.net" ]]

    // Location of the plugin's issue tracker.
    def issueManagement = [ system: "Github", url: "https://github.com/peh/jesque-admin/issues" ]

    // Online location of the plugin's browseable source code.
    def scm = [ url: "https://github.com/peh/jesque-admin/issues" ]

}
