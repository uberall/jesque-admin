package grails.plugins.jesque.admin

import grails.converters.JSON
import grails.plugins.jesque.JesqueSchedulerService
import grails.plugins.jesque.JesqueService
import grails.plugins.jesque.ScheduledJobDaoService
import net.greghaines.jesque.meta.dao.FailureDAO
import net.greghaines.jesque.meta.dao.QueueInfoDAO
import net.greghaines.jesque.meta.dao.WorkerInfoDAO
import org.springframework.http.HttpStatus

abstract class AbstractJesqueAdminController {

    FailureDAO failureDao
    QueueInfoDAO queueInfoDao
    WorkerInfoDAO workerInfoDao
    JesqueStatisticsService jesqueStatisticsService
    JesqueService jesqueService
    ScheduledJobDaoService scheduledJobDaoService
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
