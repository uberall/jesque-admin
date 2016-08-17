package grails.plugins.jesque.admin

import grails.transaction.Transactional
import net.greghaines.jesque.Config
import net.greghaines.jesque.utils.VersionUtils

@Transactional
class JesqueConfigService{

    Config jesqueConfig

    def getNamespace() {
        jesqueConfig.namespace
    }

    def getUri() {
        jesqueConfig.URI
    }

    def getVersion() {
        VersionUtils.version
    }

}
