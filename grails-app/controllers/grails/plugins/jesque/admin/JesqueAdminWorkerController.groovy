package grails.plugins.jesque.admin

import org.springframework.http.HttpStatus

class JesqueAdminWorkerController extends AbstractJesqueAdminController {

    def list() {
        jsonRender([list: jesqueWorkersService.allWorkers])
    }

    def manual() {
        def worker = request.JSON
        def clazzes
        clazzes = grailsApplication.jesqueJobClasses.findAll { it.shortName in worker.jobs }
        if (!clazzes) {
            jsonRender([status: HttpStatus.BAD_REQUEST, message: "no job found for classes $worker.jobs"])
        } else {
            def classMap = clazzes.collectEntries { [(it.clazz.simpleName): it.clazz] }

            jesqueService.startWorker(worker.queue as String, classMap)
            jsonRender()
        }
    }

    def remove() {
        jesqueWorkersService.removeWorker(params.name)
        jsonRender([success: 'OK'])
    }

    def pause() {
        jesqueService.pauseAllWorkersInCluster()
        jsonRender([success: 'OK'])
    }

    def resume() {
        jesqueService.resumeAllWorkersInCluster()
        jsonRender([success: 'OK'])
    }


}
