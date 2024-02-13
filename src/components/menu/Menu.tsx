import "./menu.scss";
import { Link } from "react-router-dom";
import { menu } from "../../data";
import { useSubAuth } from "../../components/subAdmin-authContext";
import { usePermissionContext } from "../AdmissionPermission";

const Menu = () => {
  const { isSubAuthenticated } = useSubAuth();
  const { permissions } = usePermissionContext();

  // Filter the menu based on permissions
  const filteredMenu = menu
    .map((item) => {
      // Filter listItems based on permissions
      const filteredListItems = item.listItems.filter((listItem) => {
        // Check if permissions exist and if the permission for listItem.id is true,
        // or if the permission is not present (default to true)
        return (
          !permissions ||
          (permissions[listItem.id] === undefined &&
            isSubAuthenticated &&
            listItem.id !== "ADMIN_USERS") ||
          permissions[listItem.id]
        );
      });

      return { ...item, listItems: filteredListItems };
    })
    // Remove menu items that don't have any list items left after filtering
    .filter((item) => item.listItems.length > 0);

  return (
    <div className="menu">
      {filteredMenu.map((item) => (
        <div className="item" key={item.id}>
          <span className="title">{item.title}</span>
          {item.listItems.map((listItem) => (
            <Link to={listItem.url} className="listItem" key={listItem.id}>
              <img src={listItem.icon} alt="" />
              <span id={`${listItem.title}`} className="listItemTitle">
                {listItem.title}
              </span>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Menu;
