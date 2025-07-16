import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('migrated_posts')
export class MigratedPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  
  externalId: number;

  @Column()
  userId: number;

  @Column('text')
  title: string;

  @Column('text')
  body: string;

  @Column({ type: 'datetime' })
  ingestedAt: Date;

  @Column({ type: 'datetime' })
  migratedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}