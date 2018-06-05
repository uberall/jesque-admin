package grails.plugins.jesque.admin

class JesqueAdminController extends AbstractJesqueAdminController {

    def index() {
        render(view: "jesqueAdmin.gsp")
    }

    def overview() {
        jsonRender([
                queues : queueInfoDao.queueInfos.sort { it1, it2 -> it1.name <=> it2.name },
                workers: workerInfoDao.allWorkers,
                failed : failureDao.count
        ])
    }
}
