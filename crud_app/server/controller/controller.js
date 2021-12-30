//api request

var Userdb = require('../model/model');

//create and save new user
exports.create = (req,res)=>{
    //validate request
if(!req.body){
    res.status(400).send({message: "Content can not be empty!"});
    return;
    }
    //new user
    const user = new Userdb({
        name: req.body.name,
        batch: req.body.batch,
        email:req.body.email,
        phone: req.body.phone
    })
//save user
user
.save(user)
.then(data => {
    //res.send(data)
    res.redirect('/add-user');
})
.catch(err =>{
    res.status(500).send({
        message : err.message || "Some error occurred while creating a create operation"
    });
});

}

//retrive and return all user/retrive or return a single user
exports.find = (req, res)=>{

    if(req.query.id){
        const id = req.query.id;

        Userdb.findById(id)
            .then(data =>{
                if(!data){
                    res.status(404).send({ message : "Not found user with id "+ id})
                }else{
                    res.send(data)
                }
            })
            .catch(err =>{
                res.status(500).send({ message: "Erro retrieving user with id " + id})
            })

    }else{
        Userdb.find()
            .then(user => {
                res.send(user)
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error Occurred while retriving user information" })
            })
    }

    
}

//Update a new identified user by user id
exports.update = (req,res)=>{
    if(!req.body){
        return res
        .status(400)
        .send({message: "Data to update can not be empty"})
    }
    const id = req.params.id;
    Userdb.findByIdAndUpdate(id,req.body,{useFindAndModify: false})
    .then(data=>{
        if(!data){
            res.status(404).send({message:`Cannot update user with ${id}. May be user not found!`})
        }
        else{
            res.send(data)
        }
    })
    .catch(err=>{
        res.status(500).send({message:"Error Update user information"})
    })
}

//Delete a user specified by user id
exports.delete = (req,res)=>{
    const id =req.params.id;

    Userdb.findByIdAndDelete(id)
    .then(data=>{
        if(!data){
            res.status(404).send({message:`Can not delete with id ${id}.May be id is wrong`})
        }
        else{
            res.send({message: "User was deleted successfully!"})
        }
    })
    .catch(err=>{
        res.status(500).send({message: "Couldnot delete user with id="+id});
    });
}
