import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsDate, IsUUID } from 'class-validator';
import { Project } from './Project';
import { User } from './User';
import { Media } from './Media';

@Entity()
// eslint-disable-next-line import/prefer-default-export
export class ProjectMedia extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID('4')
  id!: string;

  @ManyToOne<Project>(() => Project, (project) => project.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @IsUUID('4')
  project!: Project;

  @ManyToOne<Media>(() => Media, (media) => media.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @IsUUID('4')
  media!: Media;

  @ManyToOne<User>(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @IsUUID('4')
  user!: User;

  @CreateDateColumn({ nullable: false, type: 'timestamp with time zone' })
  @IsDate()
  createdAt!: Date;

  @UpdateDateColumn({ nullable: false, type: 'timestamp with time zone' })
  @IsDate()
  updatedAt!: Date;
}
