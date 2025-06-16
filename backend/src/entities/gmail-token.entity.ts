import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('gmail_tokens')
export class GmailToken {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'access_token', type: 'text' })
  accessToken: string;

  @Column({ name: 'refresh_token', type: 'text' })
  refreshToken: string;

  @Column({ name: 'expiry_date', type: 'bigint' })
  expiryDate: number;
}
