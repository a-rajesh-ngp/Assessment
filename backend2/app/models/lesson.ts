import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Course from './course.js'
import Assignment from './assignment.js'
import LessonProgress from './lesson_progress.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class Lesson extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare courseId: number

  @column()
  declare title: string

  @column()
  declare type: 'video'|'text'|'coding'

  @column()
  declare content: string

  @column()
  declare order: number

  @belongsTo(() => Course)
  declare course: BelongsTo<typeof Course>

  @hasMany(() => Assignment)
  declare assignments: HasMany<typeof Assignment>

  @hasMany(() => LessonProgress)
  declare progress: HasMany<typeof LessonProgress>


  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}