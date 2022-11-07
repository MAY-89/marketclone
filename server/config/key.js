if (process.env.NODE_ENV === 'production') {
    // 배포 환경
    module.exports = require('./prod');
} else {
    // 개발 모드
    module.exports = require('./dev');
}