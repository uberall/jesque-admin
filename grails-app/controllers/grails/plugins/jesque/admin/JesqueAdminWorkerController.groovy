package grails.plugins.jesque.admin

import org.springframework.http.HttpStatus

class JesqueAdminWorkerController extends AbstractJesqueAdminController {

    def list() {
        jsonRender([list: jesqueWorkersService.allWorkers])
    }

    def manual() {
        def worker = request.JSON
        def clazz
        clazz = grailsApplication.jesqueJobClasses.find { it.shortName == worker.job }
        if (!clazz) {
            jsonRender([status: HttpStatus.BAD_REQUEST, message: "no such jobClass $worker.job"])
        } else {
            jesqueService.startWorker(worker.queue, worker.job, clazz.clazz)
            jsonRender()
        }
    }

    def apiRemove() {
        // TODO: not yet supported in FE
        jesqueWorkersService.removeWorker(params.name)
        jsonRender([success: 'OK'])
    }
}
