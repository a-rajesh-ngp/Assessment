import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Lesson from './lesson.js'
import Submission from './submission.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class Assignment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare lessonId: number

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare isSubmissionAllowed: boolean

  @belongsTo(() => Lesson)
  declare lesson: BelongsTo<typeof Lesson>

  @hasMany(() => Submission)
  declare submissions: HasMany<typeof Submission>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}