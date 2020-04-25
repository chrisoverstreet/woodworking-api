import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsDate, IsUUID } from 'class-validator';
import { User } from './User';

@Entity()
// eslint-disable-next-line import/prefer-default-export
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id!: string;

  @ManyToOne<User>(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @IsUUID()
  user!: User;

  @Column({ nullable: false })
  title!: string;

  @Column({ nullable: true, type: 'text' })
  content: string | undefined;

  @CreateDateColumn({ nullable: false, type: 'timestamp with time zone' })
  @IsDate()
  createdAt!: Date;

  @UpdateDateColumn({ nullable: false, type: 'timestamp with time zone' })
  @IsDate()
  updatedAt!: Date;

  @Column({ nullable: true, type: 'timestamp with time zone' })
  @IsDate()
  publishedAt: Date | undefined;
}
