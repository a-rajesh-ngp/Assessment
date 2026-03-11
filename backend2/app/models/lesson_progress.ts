import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import Lesson from './lesson.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Enrollment from './enrollment.js'

export default class LessonProgress extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare enrollmentId: number

  @column()
  declare lessonId: number

  @column()
  declare completed: boolean

  @column.dateTime()
  declare completedAt: DateTime | null

  @belongsTo(() => Enrollment)
  declare enrollment: BelongsTo<typeof Enrollment>

  @belongsTo(() => User)
  declare student: BelongsTo<typeof User>

  @belongsTo(() => Lesson)
  declare lesson: BelongsTo<typeof Lesson>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}