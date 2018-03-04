import grails.util.BuildSettings
import grails.util.Environment

// See http://logback.qos.ch/manual/groovy.html for details on configuration
appender('STDOUT', ConsoleAppender) {
    encoder(PatternLayoutEncoder) {
        pattern = "%thread %level %logger - %msg%n"
    }
}

root(INFO, ['STDOUT'])

def targetDir = BuildSettings.TARGET_DIR
if (Environment.isDevelopmentMode() && targetDir) {
    appender("FULL_STACKTRACE", FileAppender) {
        file = "${targetDir}/stacktrace.log"
        append = true
        encoder(PatternLayoutEncoder) {
            pattern = "%level %logger - %msg%n"
        }
    }
    logger("StackTrace", ERROR, ['FULL_STACKTRACE'], false)
    logger('org.springframework', WARN, ['STDOUT'], false)
    logger('org.grails.spring', WARN, ['STDOUT'], false)
    logger('org.hibernate', WARN, ['STDOUT'], false)
    logger('grails.plugins.jesque.GrailsWorkerImpl', DEBUG, ['STDOUT'], false)
}
