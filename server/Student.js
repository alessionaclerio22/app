class Student {
    constructor(id, name, surname, courses, slots){
        this.id = id;

        if(name)
            this.name = name;
        if(surname)
            this.surname = surname;

        if(courses && courses.length)
            this.courses = courses.slice(0);


        if(slots && slots.length)
            this.slots = Array.from(slots);

    }
}

module.exports = Student;