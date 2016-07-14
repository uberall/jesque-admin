package jesque.admin

import org.apache.commons.lang.math.RandomUtils

class TestJob {

    static queue = 'TestJobQueue'

    static triggers = {
        cron queue: 'TestJobQueue', name: 'TestJobTrigger', cronExpression: '0/10 * * * * ? *'
        cron queue: 'TestJobQueue2', name: 'TestJobTrigger2', cronExpression: '0/30 * * * * ? *'
    }

    def perform() {
        sleep(RandomUtils.nextInt(10000))
    }
}
