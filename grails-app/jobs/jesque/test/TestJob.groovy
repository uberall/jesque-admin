package jesque.test

import org.apache.commons.lang.math.RandomUtils
import org.joda.time.DateTime

class TestJob {

    def jesqueService

    static queue = 'TestJobQueue'

    static triggers = {
        cron queueName: 'TestJobQueue', name: 'TestJobTrigger-1', cronExpression: '0/45 * * * * ? *', args: [1000]
        cron queueName: 'TestJobQueue', name: 'TestJobTrigger-2', cronExpression: '0 */1 * * * ? *', args: [2000]
        cron queueName: 'TestJobQueue', name: 'TestJobTrigger-3', cronExpression: '0 */2 * * * ? *', args: [2000]
        cron queueName: 'TestJobQueue', name: 'TestJobTrigger-4', cronExpression: '0/5 * * * * ? *', args: [3000]
    }

    def perform(random = RandomUtils.nextInt(60000)) {
        log.warn("sleeping for $random")
        sleep(random)
        jesqueService.enqueueAt(DateTime.now().plusMillis(random), queue, TestJob)
        if (RandomUtils.nextInt(5) == 2) {
            throw new Exception("radnom")
        }
    }
}
