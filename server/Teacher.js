class Teacher {
    
    constructor(id, name, surname, email, hash, coursecode, coursename, students, slots){
        if(id)
            this.id = id;

        this.coursecode = coursecode;
        this.coursename = coursename;

        if(name)
            this.name = name;
        
        if(surname)
            this.surname = surname;

            
        this.email = email;
        this.hash = hash;

        if(students && students.length)
            this.students = students.slice(0);

        
        if(slots && slots.length)
            this.slots = Array.from(slots);

    }




}

module.exports = Teacher;