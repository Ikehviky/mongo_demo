const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connecting to database...'))
    .catch(err => console.log('Error:', err.message));

    const createSchema = mongoose.Schema({
        title: {
            type: String,
            required: true,
            minlength: 5, 
            maxlength: 255
        },
        category:{
            type: String,
            required: true,
            // enum: ['web', 'mobile', 'cloud'],
            lowercase: true
        }, 
        author: String,
        tag: {
            isAsync: true,
            type: Array,
            validate: {
                validator: function(v){
                    setTimeout(() => {
                        const result = v && v.length > 0;
                        // callback(result);
                    },4000)
                },
                message: 'A course shoud have at least one tag.'
            }
        },
        date: {type: Date, default: Date.now},
        isPublished: Boolean,
        price: {
            type: Number, 
            required: function (){ return this.isPublished; },
            min: 10,
            max: 20 
        }
    });
    
const Course = mongoose.model('course', createSchema);

async function createCourse(){
    const course = new Course({
        title: 'angular course',
        author: 'Ikeh Victor',
        category: 'Web',
        tag: ['frontend'],
        isPublished: true,
        price: 20
    })
    
    try{
        const result = await course.save();
        console.log(result);
    }catch(ex){
        console.log(ex.message);
    }
}

// createCourse();

async function getCourses(){
    // const pageNumber = 2;//pagination
    // const pageSize = 10;

    const courses = Course
        .find({ author: "Mosh", isPublished: true })
        // .skip((pageNumber - 1) * pageSize)
        // .limit(pageSize)
        .sort({ name: 1 })
        .select({ name:1, tags: 1 });
    console.log(courses);
}


// updating a document by finding by id
async function updateCourse(id){
    const course = await Course.findById(id);
    if(!course) return "This course does not exist";
   course.set({
       isPublished: true,
       author: 'Another Author', 
   })

   const result = await course.save();
   console.log(result);
}


// updating a document direct in mongodb compass
// async function updateCourse(id){
//     const result = await Course.update({_id: id}, {
//         author: 'Mosh',
//         isPublished: true
//     })
   
//    console.log(result);
// }


//finding and updating at once and also sowing updated id
// async function updateCourse(id){
//     const result = await Course.findByIdAndUpdate(id, {
//       $set: {
//         author: 'ikeh vasdafsd',
//         isPublished: true
//       }
//     }, {new: true})
   
//    console.log(result);
// }

async function removeCourse(id){
   const result = await Course.deleteOne({_id: id});
//    const result = await Course.deleteOne(id);
   console.log(result);
}

// removeCourse("61bd452bbe51fe774e28c87c");