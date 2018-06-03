package grails.plugins.jesque.admin

import grails.converters.JSON
import grails.plugins.jesque.JesqueSchedulerService
import grails.plugins.jesque.JesqueService
import org.springframework.http.HttpStatus

abstract class AbstractJesqueAdminController {

    JesqueQueuesService jesqueQueuesService
    JesqueFailureService jesqueFailureService
    JesqueWorkersService jesqueWorkersService
    JesqueStatisticsService jesqueStatisticsService
    JesqueService jesqueService
    JesqueScheduledService jesqueScheduledService
    JesqueSchedulerService jesqueSchedulerService

    protected void jsonRender(model = [:]) {
        response.contentType = 'application/json'
        if (!model.status) {
            model.status = HttpStatus.OK
        }
        response.status = model.status.value()
        model.status = model.status.name()
        render model as JSON
    }

    protected void sanitizeParams() {
        params.max = params.max ?: 20
        params.offset = params.offset ?: 0
    }
}
