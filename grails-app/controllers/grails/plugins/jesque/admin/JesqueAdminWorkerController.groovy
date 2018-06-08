package grails.plugins.jesque.admin

import org.springframework.http.HttpStatus

class JesqueAdminWorkerController extends AbstractJesqueAdminController {

    def list() {
        jsonRender([list: workerInfoDao.allWorkers])
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
            jsonRender([success: true])
        }
    }

    def remove() {
        workerInfoDao.removeWorker(params.name)
        jsonRender([success: true])
    }

    def pause() {
        jesqueService.pauseAllWorkersInCluster()
        jsonRender([success: true])
    }

    def resume() {
        jesqueService.resumeAllWorkersInCluster()
        jsonRender([success: true])
    }

}
