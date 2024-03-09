module.exports.checkAuth = function(request, response, next) {

    const UserId = request.session.userid

    if(!UserId) {
        response.redirect('/login')
    }

    next()
}