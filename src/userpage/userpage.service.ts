import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import _ from "lodash";
import { Repository } from "typeorm";
import { Users } from "src/user/entity/user.entity";
import { Clubs } from "src/club/entity/club.entity";
import { EventPosts } from "../event/entity/event.entity";
// import { UserUpdateDto } from "./dto/userpage.update.dto";
import { title } from "process";

@Injectable()
export class UserpageService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
    @InjectRepository(Clubs) private clubRepository: Repository<Clubs>,
    @InjectRepository(EventPosts)
    private eventRepository: Repository<EventPosts>,
  ) {}

  async getMyPosts(userId: number) {
    // 회원이 쓴 글 조회 테이블2개에서 정보 가져와서 뿌려주기
    const clubPosts = await this.clubRepository.find({
      // where: { userId },
      select: ["title", "content"],
    });
    const eventPosts = await this.eventRepository.find({
      where: { userId },
      select: ["title"],
    });
    return { clubPosts, eventPosts };
  }

  async checkThisUser(userId: number) {
    // 회원정보 조회
    return await this.userRepository.findOne({
      where: { userId },
      select: ["nickName", "email", "snsURL", "userIMG", "createdAt"], // 가져올 항목 확인하기.
    }); // createdAt 은 가입일 정보..
  }
  async getMyInfo(userId: number) {
    // 본인정보 조회, 본인인지 인증절차 거쳐서 위 코드 + 나머지 정보 볼 수 있게 할 수 있나?

    return await this.userRepository.findOne({
      where: { userId },
      select: [
        "email",
        "password",
        "phone",
        "nickName",
        "snsURL",
        "userIMG",
        "createdAt",
      ],
    });
  }

  async updateUser(userId: number, UserUpdateDto) {
    console.log(UserUpdateDto);
    return await this.userRepository.update(userId, UserUpdateDto);
  } // 회원정보 수정

  //   async getMyClubs(userId: number) {
  //     return await this.clubRepository.findOne({
  //       where: { userId },
  //       select: ["title", "content"],
  //     });
  //   } //운영중인 모임 전체 보기

  //   async getClubApps(userId: number) {
  //     return await this.clubRepository.find({
  //       where: { userId },
  //       select: ["title", "content"],
  //     });
  //   }

  //   async getThisApp(userId: number, clubMemberId: number) {
  //     return await this.clubRepository.find({
  //       where: { userId },
  //       select: [],
  //     });
  //   }

  //   async getThisMember(userId: number, clubMemberId: number) {
  //     return await this.clubRepository.find();
  //   }
  // async deleteApps(userId: number, clubMemberId: number) { }
}
