const Project = require('../models/Project')
const User = require('../models/User')

module.exports = class ProjectController {

    static async showProjects(request, response) {

        let projectsData = []

        const userId = request.session.userid
        let projects = []
        
        if(userId) {

            projectsData = await User.findOne({ where: {id : userId}, include: [Project]})

            if(projectsData){
                projects = projectsData.Projects.map((result) => result.dataValues)
            }
            
        }else{
            projectsData = await Project.findAll()
            projects = projectsData.map((result) => result.dataValues)
        }
        
        let empytProjects = false
        
        if(projects.length === 0){
            empytProjects = true
        }

        if(projects instanceof Array){
         //   projects = [projects.Object]
        }
        
        response.render('projects/home', { projects, empytProjects })
    }

    static createProject(request, response) {
        response.render('projects/create')
    }

    static async removeProject(request, response) {
        const id = request.body.id

        try {
            await Project.destroy({where: {id:id}, UserId: request.session.userid})
            request.flash('message', 'Projeto removido com sucesso!')
            
            request.session.save(() => {
                response.redirect('/projects/dashboard')
            }) 

        } catch (error) {
            console.log(error)
        }
    }

    static async createProjectSave(request, response) {

        const project = {
            name: request.body.name,
            UserId: request.session.userid
        }
        

        try {

            const projectSaved = await Project.create(project)
            const user = await User.findOne({where: {id : request.session.userid}})
            user.addProjects(projectSaved)

            request.flash('message', 'Projeto criado com sucesso!')
            
            request.session.save(() => {
                response.redirect('/projects/dashboard')
            }) 
    

        } catch (error) {
            console.log(error)
        }
        
    }

    static async dashboard(request, response) {

        const user = await User.findOne({where: {id : request.session.userid}, include: Project, plain: true})

        if(!user){
            response.redirect('/login')
        }

        const userProjects = user.Projects.map((result) => result.dataValues)
        let empytProjects = false
        
        if(userProjects.length === 0){
            empytProjects = true
        }

        response.render('projects/dashboard', { userProjects, empytProjects })
    }
}