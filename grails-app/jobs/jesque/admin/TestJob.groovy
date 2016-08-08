package jesque.admin

import org.apache.commons.lang.math.RandomUtils

class TestJob {

    static triggers = {
        cron queue: 'TestJobQueue', name: 'TestJobTrigger', cronExpression: '0/10 * * * * ? *'
        cron queue: 'TestJobQueue2', name: 'TestJobTrigger2', cronExpression: '0/30 * * * * ? *'
    }

    def perform(random = RandomUtils.nextInt(1000)) {
        log.warn("sleeping for $random")
        sleep(random)
        if (random % 5 == 0) {
            throw new Exception("slepped for $random which is divisble by 5!")
        }
    }
}
