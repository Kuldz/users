import { PrismaClient } from "@prisma/client"

/*
const studentArray = [
  {
    email: "artur.kaasik@tptlive.ee",
    firstname: "Artur",
    lastname: "Kaasik",
    school_id: 123,
    class_id: 321
  },

  {
    email: "harri.sink@tptlive.ee",
    firstname: "Harri",
    lastname: "Sink",
    school_id: 456,
    class_id: 654
  },
  {
    email: "martin.kangsepp@tptlive.ee",
    firstname: "Martin",
    lastname: "Kangsepp",
    school_id: 456,
    class_id: 654
  }
] */

export default async function handler (req, res) {
  const {
    query: { id },
    method
  } = req

  const prisma = new PrismaClient()

  switch (method) {
    case "GET": {
      // Filter studentArray by school ID
      // const students = studentArray.filter(s => s.school_id.toString() === id)
      const students = await prisma.student.findUnique({
        where: {
          id: parseInt(id)
        }
      })

      // Return 404 if no result or OK status and students array
      students ? res.status(200).json({ students }) : res.status(404).json({ error: `Could not find student by ID ${id}` })
      break
    }

    case "DELETE": {
      await res.status(202)
      await prisma.student.delete({
        where: {
          id: parseInt(id)
        }
      })
      break
    }

    case "POST": {
      console.log(req.body)
      const newSchool = await prisma.school.create({
        data: req.body.school
      })
      res.status(201).json(newSchool)
      break
    }

    default:
      res.status(405)
      break
  }
}
