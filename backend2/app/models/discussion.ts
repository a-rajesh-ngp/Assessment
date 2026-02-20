import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Course from './course.js'
import User from './user.js'
import DiscussionReply from './discussion_reply.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class Discussion extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare courseId: number

  @column()
  declare userId: number

  @column()
  declare title: string

  @column()
  declare body: string

  @belongsTo(() => Course)
  declare course: BelongsTo<typeof Course>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => DiscussionReply)
  declare replies: HasMany<typeof DiscussionReply>



  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}