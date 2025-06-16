import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('gmail_messages')
export class GmailMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'gmail_id' })
  gmailId: string;

  @Column({ name: 'thread_id' })
  threadId: string;

  @Column({ nullable: true })
  subject: string;

  @Column({ nullable: true })
  sender: string;

  @Column({ nullable: true })
  snippet: string;

  @Column('text')
  body: string;

  @CreateDateColumn({ name: 'imported_at' })
  importedAt: Date;
}
