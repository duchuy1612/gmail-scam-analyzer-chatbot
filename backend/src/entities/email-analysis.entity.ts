import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('email_analyses')
export class EmailAnalysis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'text', name: 'email_content' })
  emailContent: string;

  @Column({ nullable: true, name: 'email_subject' })
  emailSubject: string;

  @Column({ nullable: true, name: 'email_sender' })
  emailSender: string;

  @Column({ type: 'json', name: 'analysis_result' })
  analysisResult: any;

  @Column({ type: 'decimal', precision: 3, scale: 2, name: 'risk_score' })
  riskScore: number;

  @Column({ name: 'is_scam' })
  isScam: boolean;

  @CreateDateColumn({ name: 'analyzed_at' })
  analyzedAt: Date;

  @ManyToOne(() => User, user => user.emailAnalyses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
