import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import Lesson from './lesson.js'
import Enrollment from './enrollment.js'
import Discussion from './discussion.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class Course extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare instructorId: number

  @belongsTo(() => User, {foreignKey: 'instructorId'})
  declare instructor: BelongsTo<typeof User>

  @hasMany(() => Lesson)
  declare lessons: HasMany<typeof Lesson>

  @hasMany(() => Enrollment)
  declare enrollments: HasMany<typeof Enrollment>

  @hasMany(() => Discussion)
  declare discussions: HasMany<typeof Discussion>


  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}