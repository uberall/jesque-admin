package grails.plugins.jesque.admin

class JesqueAdminController extends AbstractJesqueAdminController {

    def index() {
        render(view: "jesqueAdmin.gsp")
    }

    def overview() {
        jsonRender([
                queues : jesqueQueuesService.queueInfos,
                workers: jesqueWorkersService.allWorkers,
                failed : jesqueFailureService.count
        ])
    }
}
