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
export class Media extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID('4')
  id!: string;

  @Column({ nullable: false, comment: 'Cloudinary public_id' })
  publicId!: string;

  @ManyToOne<User>(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @IsUUID('4')
  user: User | undefined;

  @Column({ nullable: false })
  contentType!: string;

  @Column({ nullable: false, type: 'smallint' })
  height!: number;

  @Column({ nullable: false, type: 'smallint' })
  width!: number;

  @Column({
    nullable: false,
    enum: ['image', 'raw', 'video'],
    type: 'enum',
  })
  resourceType!: 'image' | 'raw' | 'video';

  @Column({ nullable: false, type: 'integer' })
  bytes!: number;

  @Column({ nullable: false })
  format!: string;

  @CreateDateColumn({ nullable: false, type: 'timestamp with time zone' })
  @IsDate()
  createdAt!: Date;

  @UpdateDateColumn({ nullable: false, type: 'timestamp with time zone' })
  @IsDate()
  updatedAt!: Date;
}
