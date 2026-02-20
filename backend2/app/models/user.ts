import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Course from './course.js'
import Enrollment from './enrollment.js'
import Submission from './submission.js'
import Discussion from './discussion.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare username: string

  @column({serializeAs: null})
  declare password: string

  @column()
  declare email: string

  @column()
  declare role: 'student' | 'instructor'

  @hasMany(() => Course, {foreignKey: 'instructorId'})
  declare courses : HasMany<typeof Course>

  @hasMany(() => Enrollment)
  declare enrollments: HasMany<typeof Enrollment>

  @hasMany(() => Submission)
  declare submissions: HasMany<typeof Submission>

  @hasMany(() => Discussion)
  declare discussions: HasMany<typeof Discussion>




  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}