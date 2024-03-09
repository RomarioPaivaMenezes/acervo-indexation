const Project = require('../models/Project')
const User = require('../models/User')
const Baptism = require('../models/Baptism')

const { Op } = require('sequelize')

module.exports = class ProjectController {

    static async showBaptisms(request, response) {

        const projectId = request.params.projectId
        let search = ''

        if(request.query.search){
            search = request.query.search
        }

        let order = 'DESC'
        if(request.query.order === 'old') {
            order = 'ASC'
        }else {
            order = 'DESC'
        }

        const projectsData = await Project.findOne({ 
            where: { 
                id: projectId
            }, 
            include: [{ 
                model: Baptism, 
                where: { 
                    name: {[Op.like]: `%${search}%`},
                }, 
            }],
            order: [['Baptisms','createdAt', order ]]   
        })

        let baptisms = []
        
        try {
            baptisms = projectsData.Baptisms.map((result) => result.dataValues)
        } catch (error) {
            
        }

        let baptismsQty = baptisms.length
        
        if(baptismsQty === 0){
            baptismsQty = false
        }

        console.log(baptisms)
        response.render('indexings/home', { baptisms, projectId, search, baptismsQty})
    }

    static async showAllBaptisms(request, response) {

        const projectId = request.param.projectId

        const baptims = await Baptism.findAll({include : Project})
        const projects = baptims.map((result) => result.Baptisms)

        let empytProjects = false
        
        if(projects.length === 0){
            empytProjects = true
        }

        response.render('indexings/home', { baptims })
    }  

    static async createBaptisms(request, response) {

        const projectId = request.body.projectId
        const userid = request.session.userid
        
        if(!userid){
            response.redirect('/login')
        }

        const baptism = {
            birthDate: request.body.birthDate, 
            name: request.body.name,
            father: request.body.father,
            mother: request.body.mother,
            godparents: request.body.godparents,
            observacao: request.body.observacao
        }

        const project = await Project.findOne({where: { id : projectId}})
        const baptims = await Baptism.create(baptism)
        const user = await User.findOne({where: {id : userid}})

        await user.addBaptism(baptims)

        if(project){
            await baptims.addProject(project)
            await project.addBaptism(baptims)
        }

        request.flash('message', 'Novo Index adicionado com sucesso!')
            
        request.session.save(() => {
            response.redirect(`/indexings/baptisms/${projectId}`)
        }) 

    }

    static async addBaptisms(request, response) {
        const projectId = request.params.projectId
        response.render('indexings/create', { projectId })
    }

    static async removeBaptisms(request, response) {

        const baptismsId = request.body.id
        const projectId = request.body.ProjectId

        await Baptism.destroy({ where: {id: baptismsId}})

        request.flash('message', 'Index removido com sucesso!')
            
        request.session.save(() => {
            response.redirect(`/indexings/baptisms/${projectId}`)
        }) 

    }
    

    static async dashboard(request, response) {
        const projectId = request.params.projectId
        response.render('indexings/dashboard', { projectId })
    }

}