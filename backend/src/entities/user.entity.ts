import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { EmailAnalysis } from './email-analysis.entity';
import { ChatSession } from './chat-session.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => EmailAnalysis, analysis => analysis.user)
  emailAnalyses: EmailAnalysis[];

  @OneToMany(() => ChatSession, session => session.user)
  chatSessions: ChatSession[];
}

export interface CreateUserData {
  email: string;
  name: string;
  password: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
}
