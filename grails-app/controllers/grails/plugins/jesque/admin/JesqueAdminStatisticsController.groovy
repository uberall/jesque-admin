package grails.plugins.jesque.admin

class JesqueAdminStatisticsController extends AbstractJesqueAdminController {

    def jobs() {
        sanitizeParams()
        List classes = grailsApplication.jesqueJobClasses
        List<String> jobNameList = []
        if (classes) {
            jobNameList.addAll(classes.shortName.sort())
        }

        if (params.query) {
            jobNameList = jobNameList.findAll { it.toLowerCase().indexOf("$params.query".toLowerCase()) > -1 }
        }

        int offset = params.getInt('offset', 0)
        int max = params.getInt('max', 100)
        jobNameList = jobNameList.subList(offset, Math.min((offset + max), jobNameList.size()))

        List jobs = jobNameList.collect { it ->
            [name: it, jobs: jesqueStatisticsService.getStatisticCount(it)]
        }
        jsonRender([
                list : jobs,
                total: jobNameList.size()
        ])
    }

    def list(String job) {
        sanitizeParams()
        int offset = params.getInt('offset')
        int max = params.getInt('max')
        def total = jesqueStatisticsService.getStatisticCount(job)
        def list = jesqueStatisticsService.getStatistics(job, offset, max)
        jsonRender([
                list : list,
                total: total
        ])
    }

}
