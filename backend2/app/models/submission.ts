import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasOne } from '@adonisjs/lucid/orm'
import Assignment from './assignment.js'
import User from './user.js'
import Grade from './grade.js'
import File from './file.js'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'

export default class Submission extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare assignmentId: number

  @column()
  declare userId: number

  @column()
  declare enrollmentId: number

  @column()
  declare fileId: number | null

  @column()
  declare status: 'submitted' | 'graded' | 'resubmitted'

  @belongsTo(() => File)
  declare file: BelongsTo<typeof File>  

  @belongsTo(() => Assignment)
  declare assignment: BelongsTo<typeof Assignment>

  @belongsTo(() => User)
  declare student: BelongsTo<typeof User>

  @hasOne(() => Grade)
  declare grade: HasOne<typeof Grade>


  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}