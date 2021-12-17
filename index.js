const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to MogoDB...'))
    .catch(err => console.error('Could not connect to MogoDB', err))

const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [String],
    data: { type:Date, default: Date.now },
    isPublished: Boolean
});

const Course = mongoose.model('Course', courseSchema)

async function createCourse() {
    const course = new Course({
        name: 'Angular course',
        author: 'victor',
        tags: ['Angular', 'frontEnd'],
        isPublished: true
    })
    
    const result = await course.save();
    console.log(result);
};

async function getCourses(){
    const courses = await Course
        .find({ author:'victor', isPublished:true })
        .limit(10)
        .sort({name: -1})
        .select({name:1, tags:1});
    console.log(courses);
}

getCourses();