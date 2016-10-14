package grails.plugins.jesque.admin

class JesqueAdminStatisticsController extends AbstractJesqueAdminController {

    def jobs() {
        sanitizeParams()
        List list = grailsApplication.jesqueJobClasses
        if(list) {
            list = list.shortName
        }

        int offset = params.getInt('offset', 0)
        int max = params.getInt('max', 100)
        jsonRender([
                list : list.subList(offset, Math.min((offset + max), list.size())),
                total: list.size()
        ])
    }

    def list(String job) {
        sanitizeParams()
        int offset = params.getInt('offset')
        int max = params.getInt('max')
        def total = jesqueStatisticsService.getStatisticCount(job)
        if (!total) {
            renderNotFound()
        } else {
            def list = jesqueStatisticsService.getStatistics(job, offset, max)
            jsonRender([
                    list : list,
                    total: total
            ])
        }
    }

}
