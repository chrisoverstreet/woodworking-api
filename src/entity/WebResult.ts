import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsDate, IsUrl, IsUUID } from 'class-validator';
import { User } from './User';
import { Media } from './Media';

@Entity()
// eslint-disable-next-line import/prefer-default-export
export class WebResult extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID('4')
  id!: string;

  @ManyToOne<User>(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @IsUUID('4')
  user!: User;

  @OneToOne<Media>(() => Media, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn()
  @IsUUID('4')
  media!: Media;

  @Column({ nullable: false, unique: true })
  @IsUrl()
  url!: string;

  @Column({ nullable: false })
  title!: string;

  @Column({ nullable: true, type: 'text' })
  content: string | undefined;

  @Column({ nullable: true, type: 'varchar' })
  author: string | undefined;

  @CreateDateColumn({ nullable: false, type: 'timestamp with time zone' })
  @IsDate()
  createdAt!: Date;

  @UpdateDateColumn({ nullable: false, type: 'timestamp with time zone' })
  @IsDate()
  updatedAt!: Date;
}
