package grails.plugins.jesque.admin

class JesqueAdminStatisticsController extends AbstractJesqueAdminController {

    def jobs() {
        sanitizeParams()
        List<String> jobNameList = grailsApplication.jesqueJobClasses.collect { it.shortName }.sort() as List<String>

        if (params.query) {
            jobNameList = jobNameList.findAll { it.toLowerCase().indexOf("$params.query".toLowerCase()) > -1 }
        }

        int total = jobNameList.size()
        int offset = params.getInt('offset', 0)
        int max = params.getInt('max', 100)
        jobNameList = jobNameList.subList(offset, Math.min((offset + max), jobNameList.size()))

        List jobs = jobNameList.collect { it ->
            [name: it, jobs: jesqueStatisticsService.getStatisticCount(it)]
        }

        jsonRender([
                list : jobs,
                total: total
        ])
    }

    def list(String job) {
        sanitizeParams()
        int offset = params.getInt('offset')
        int max = params.getInt('max')
        long total = jesqueStatisticsService.getStatisticCount(job)
        List list = jesqueStatisticsService.getStatistics(job, offset, max)

        jsonRender([
                list : list,
                total: total
        ])
    }

}
