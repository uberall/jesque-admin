package jesque.admin

import grails.converters.JSON
import grails.core.GrailsApplication
import grails.plugins.jesque.JesqueService
import org.springframework.http.HttpStatus

abstract class AbstractJesqueAdminController {

    JesqueConfigService jesqueConfigService
    JesqueAdminService jesqueAdminService
    JesqueQueuesService jesqueQueuesService
    JesqueFailureService jesqueFailureService
    JesqueWorkersService jesqueWorkersService
    JesqueService jesqueService
    JesqueScheduledService jesqueScheduledService
    GrailsApplication grailsApplication

    protected void jsonRender(model) {
        response.contentType = 'application/json'
        if (!model.status) {
            model.status = HttpStatus.OK.toString()
        } else {
            model.status.toString()
        }
        render model as JSON
    }

    def beforeInterceptor = {
        if (!grailsApplication.config.grails.jesque.enabled) {
            render "Jesque is disabled!"
            return false
        }
    }

    protected void sanitizeParams() {
        params.max = params.max ?: 20
        params.offset = params.offset ?: 0
    }
}
