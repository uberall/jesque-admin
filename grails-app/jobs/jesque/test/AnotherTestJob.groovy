package jesque.test

import org.apache.commons.lang.math.RandomUtils

class AnotherTestJob {

    static queue = 'TestJobQueue'

    def perform(random = RandomUtils.nextInt(60000)) {
        if (random % 5 == 0) {
            throw new Exception("slepped for $random which is divisble by 5!")
        }
    }
}
