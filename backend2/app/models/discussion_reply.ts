import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Discussion from './discussion.js'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class DiscussionReply extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare discussionId: number

  @column()
  declare userId: number

  @column()
  declare body: string

  @belongsTo(() => Discussion)
  declare discussion: BelongsTo<typeof Discussion>

  @belongsTo(() => User, { foreignKey: 'userId' })
  declare author: BelongsTo<typeof User>

  
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}