package jesque.test

import org.apache.commons.lang.math.RandomUtils
import org.joda.time.DateTime

class TestJob {

    def jesqueService

    static queue = 'TestJobQueue'

    static triggers = {
        cron queueName: 'TestJobQueue', name: 'TestJobTrigger', cronExpression: '0/45 * * * * ? *'
    }

    def perform(random = RandomUtils.nextInt(60000)) {
        log.warn("sleeping for $random")
        sleep(random)
        jesqueService.enqueueAt(DateTime.now().plusSeconds(random), queue, TestJob)
        if (random % 5 == 0) {
            throw new Exception("slepped for $random which is divisble by 5!")
        }
    }
}
