package grails.plugins.jesque.admin

import grails.core.GrailsApplication

class JesqueAdminInterceptor {

    GrailsApplication grailsApplication

    JesqueAdminInterceptor() {
        match(controller: ~/(jesqueAdmin.*)/)
    }

    boolean before() {
        if (!grailsApplication.config.grails.jesque.enabled) {
            render "Jesque is disabled!"
            return false
        }

        return true
    }

}
