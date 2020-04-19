package grails.plugins.jesque.admin

import net.greghaines.jesque.JobFailure

class JesqueAdminJobController extends AbstractJesqueAdminController {

    def failed() {
        sanitizeParams()

        long offset = params.getLong("offset", 0)
        def list = failureDao.getFailures(offset, params.getLong("max"))
        list.eachWithIndex { JobFailure entry, int i ->
            entry.metaClass.id = offset + i
        }
        jsonRender([
                list : list,
                total: failureDao.count
        ])
    }

    def retry(Long id) {
        failureDao.requeue(id)
        jsonRender([success: true])
    }

    def remove(Long id) {
        failureDao.remove(id)
        jsonRender([success: true])
    }

    def clear() {
        failureDao.clear()
        jsonRender([success: true])
    }

    def triggers() {
        jsonRender([list: scheduledJobDaoService.all.sort { it.trigger.nextFireTime.millis }.collect {
            [name          : it.name,
             cronExpression: it.cronExpression,
             args          : it.args,
             jesqueJobName : it.jesqueJobName,
             jesqueJobQueue: it.jesqueJobQueue,
             trigger       : [
                     jobName     : it.trigger.jobName,
                     nextFireTime: it.trigger.nextFireTime.millis,
                     state       : it.trigger.state.toString(),
                     acquiredBy  : it.trigger.acquiredBy,
             ]]
        }])
    }

    def deleteTrigger(String name) {
        jesqueSchedulerService.deleteSchedule(name)
        jsonRender([success: true])
    }

    def enqueue() {
        def json = request.JSON
        jesqueService.enqueue(json.queue, json.job, json.args)
        jsonRender([success: true])
    }

    def removeDelayed() {
        def json = request.JSON
        jesqueService.removeDelayed(json.queue, json.job, json.args)
        jsonRender([success: true])
    }

}
